import axios from 'axios';
import { compare, hash } from 'bcrypt'
import { GraphQLClient, gql } from 'graphql-request'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { authService } from "../../../services/auth.service.ts";
import 'dotenv/config'
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const login = async (username, password) => {
    console.log(apiUrl);
    return axios.get(`${apiUrl}?query=mutation{login(input:{username:"${username}",password:"${password}"}){access_token,token_type,expires_in,refresh_token,user{name,id,email,role{id,description,statut,code}}}}`)
    .then((res) => {
      //console.log(res.data.data);
      const u = {
        username: res.data.data.login.user.name,
        //avatar: res.data.login.avatar,
        id: res.data.data.login.user.id,
        roleId:res.data.data.login.user.role.id,
        accessToken: res.data.data.login.access_token,
        expiredAt: res.data.data.login.expires_in,
      }
      //console.log(u);
       return u ;
    });
    
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
                access_token:(await u).accessToken // <-- retrive JWT token from Drupal response
              };
              return {
                token: user.access_token,
                name:user.name,
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