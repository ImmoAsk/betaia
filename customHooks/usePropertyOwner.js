import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../utils/settings";

function useLandLord(role) {
  return useQuery(["landlords", role], () => {
    const query = `{getPropertyOwners(role_id:${role}){id,name,phone,email,organisation{logo,name_organisation,status,id}}}`;
    const fullUrl = `${API_URL}?query=${encodeURIComponent(query)}`;
    console.log("Landlord fetch URL:", fullUrl); // ✅ Log full URL

    return axios.get(fullUrl).then(res => res.data.data.getPropertyOwners);
  });
}

function useTenant(role) {
  return useQuery(["tenants", role], () => {
    const query = `{getPropertyOwners(role_id:${role}){id,name,phone,email,organisation{logo,name_organisation,status,id}}}`;
    const fullUrl = `${API_URL}?query=${encodeURIComponent(query)}`;
    console.log("Tenant fetch URL:", fullUrl); // ✅ Log full URL

    return axios.get(fullUrl).then(res => res.data.data.getPropertyOwners);
  });
}

function useLandlordTenant(landlord_id) {
  return useQuery(["tenants", landlord_id], () => {
    const query = `{getLandlordTenants(proprietaire_id:${Number(landlord_id)}){id,proprietaire{id,name,phone,email},locataire{id,name,phone,email}}}`;
    const fullUrl = `${API_URL}?query=${encodeURIComponent(query)}`;
    console.log("Tenant fetch URL:", fullUrl); // ✅ Log full URL

    return axios.get(fullUrl).then(res => res.data.data.getLandlordTenants);
  });
}

export { useLandLord, useTenant , useLandlordTenant };
