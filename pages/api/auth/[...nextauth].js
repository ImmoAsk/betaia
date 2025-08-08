import axios from 'axios';
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import 'dotenv/config'
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const login = async (username, password) => {
  const query = `
    mutation Login($username: String!, $password: String!) {
      login(input: { username: $username, password: $password }) {
        access_token
        token_type
        expires_in
        refresh_token
        user {
          name
          id
          phone
          avatar
          adresse
          email
          role {
            id
            roleName
            code
            description
          }
        }
      }
    }
  `;

  const variables = { username, password };

  try {
    const res = await axios.post(apiUrl, { query, variables });

    // Debug: show raw GraphQL response
    console.log("GraphQL raw response:", res.data);

    if (res.data.errors) {
      throw new Error(res.data.errors[0]?.message || "Login failed");
    }

    if (!res.data.data?.login) {
      throw new Error("Login data missing in response");
    }

    const data = res.data.data.login;

    const u = {
      username: data.user.name,
      id: data.user.id,
      roleId: data.user.role.id,
      accessToken: data.access_token,
      expiredAt: data.expires_in,
      userEmail: data.user.email,
      userPhone: data.user.phone,
      userAvatar: data.user.avatar
    };

    //console.log("User object:", u);
    return u;
  } catch (err) {
    console.error("Login failed", err.message);
    throw err;
  }
};
export const authOptions = {
    providers: [
        CredentialsProvider({
            async authorize(credentials, req) {
              //Request our API to check user credential
              const u = login(req.body.email, req.body.password); // login and get user data
              
              const user = {
                id:(await u).id,
                name: (await u).username,
                roleId:(await u).roleId,
                email:(await u).userEmail,
                phone:(await u).userPhone,
                avatar:(await u).userAvatar,
                access_token:(await u).accessToken // <-- retrive JWT token from Drupal response
              };
              console.log("User data:", user);
              return {
                token: user.access_token,
                name:user.name,
                email:user.email,
                phone:user.phone,
                avatar: user.avatar,
                id:user.id,
                roleId:user.roleId,
              };
            },
          }),
    ],
    callbacks: {
      jwt: async ({ token, user }) => {
        user && (token.user = user);
        return token;
      },
      session: async ({ session, token }) => {
        session.user = token.user;  // Setting token in session
        return session;
      },
      redirect: async ({ url, baseUrl })=> {
        // Allows relative callback URLs
        if (url.startsWith("/")) return `${baseUrl}${url}`
        // Allows callback URLs on the same origin
        else if (new URL(url).origin === baseUrl) return url
        console.log(baseUrl);
        return baseUrl
      }
    },
    pages: {
      signIn: '/auth/signin',
      signOut: '/auth/signout',
      error: '/auth/error',
    }
};
  
export default NextAuth(authOptions)