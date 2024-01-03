import axios from "axios";

const getPropertyByFullUrl = async (url) => {
  const { data } = await axios.get(`${url}`);
  return data;
};
export default getPropertyByFullUrl;
