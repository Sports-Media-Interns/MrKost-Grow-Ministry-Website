
const GHL_TOKEN = "pit-00cb8ded-1bcf-4855-9146-f03972dc5f92";
const GHL_LOCATION_ID = "ysdCFupPEEPdGlWw2bqR";
const GHL_API_BASE = "https://services.leadconnectorhq.com/contacts/";

export interface GHLContactData {
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  phone?: string;
  website?: string;
  companyName?: string;
  tags: string[];
}

export const createGHLContact = async (data: GHLContactData) => {
  try {
    const payload = {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      name: data.name || `${data.firstName} ${data.lastName}`.trim(),
      email: data.email,
      phone: data.phone || "",
      website: data.website || "",
      locationId: GHL_LOCATION_ID,
      companyName: data.companyName || "",
      tags: data.tags,
      source: "public api"
    };

    const response = await fetch(GHL_API_BASE, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GHL_TOKEN}`,
        "Version": "2021-07-28",
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("CRM Response Error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error("CRM Network/Connection Failure:", error);
    return false;
  }
};
