import axios from "axios";
import nodeCron from "node-cron";
import { Campaign } from "../../models/campaign.Model";
import { readTokenFromFile } from "./zaloJobTokenService";
import { CampaignResult } from "../../models/campaign-result.Model";

export const scheduledJobs = new Map<string, nodeCron.ScheduledTask>();

const getTemplateSampleData = async (template: string) => {
  const { access_token } = readTokenFromFile();
  const url = `https://business.openapi.zalo.me/template/sample-data?template_id=${template}`;

  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        access_token,
      },
    });

    if (response.data.error === 0) {
      return response.data.data;
    } else {
      console.error(
        `Error fetching template sample data: ${response.data.message}`
      );
      return null;
    }
  } catch (error) {
    console.error(
      `Failed to fetch template sample data for template ${template}:`,
      error
    );
    return null;
  }
};

export const sendZns = async ({
  template,
  name,
  customers,
  _id, 
  cb,
}: {
  template: string;
  name: string;
  customers: any[];
  _id?: string;
  cb: (response: { template: string; customers: any[] }) => void;
}) => {
  const { access_token } = readTokenFromFile();
  const url = "https://business.openapi.zalo.me/message/template";

  const templateFields = await getTemplateSampleData(template);
  if (!templateFields) {
    console.error("Failed to fetch template fields, aborting ZNS send.");
    return;
  }

  const campaignResults: any[] = [];
  const formatPhoneNumber = (phone: string) => {
    if (phone.startsWith("0")) {
      return `84${phone.slice(1)}`;
    }
    return phone;
  };

  await Promise.all(
    customers.map(async (customer) => {
      const templateData: any = {};
      Object.keys(templateFields).forEach((field) => {
        templateData[field] = customer[field] || "N/A";
      });

      const requestData = {
        phone: formatPhoneNumber(customer.phone),
        template_id: template,
        template_data: templateData,
        tracking_id: "tracking_id",
      };

      const sendTime = new Date();

      try {
        const response = await axios.post(url, requestData, {
          headers: {
            "Content-Type": "application/json",
            access_token,
          },
        });
        const isSuccess = response.data.error === 0;
        campaignResults.push({
          template: template,
          name: customer.name,
          phone: customer.phone,
          createdAt: sendTime,
          status: isSuccess ? "success" : "failure",
          campaign_name: name,
          campaign_id: _id,
        });
      } catch (error) {
        console.error(`Error sending ZNS for phone ${customer.phone}:`, error);
        campaignResults.push({
          template: template,
          name: customer.name,
          phone: customer.phone,
          createdAt: sendTime,
          status: "failure",
          campaign_name: name,
          campaign_id: _id,
        });
      }
    })
  );

  if (_id) {
    try {
      // Lưu kết quả vào CustomerResult
      await CampaignResult.insertMany(campaignResults);
    } catch (err) {
      console.error(
        `Failed to save customer results for campaign ${_id}:`,
        err
      );
    }
  }

  cb({ template, customers: campaignResults });
};

export const scheduleZns = ({
  template,
  name,
  customers,
  startAt,
  _id,
}: {
  template: string;
  name: string;
  customers: any[];
  startAt: Date | string;
  _id?: string;
}) => {
  const date = new Date(startAt);
  const now = new Date();

  if (date > now) {
    const cronTime = `${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${
      date.getMonth() + 1
    } *`;

    const job = nodeCron.schedule(cronTime, () => {
      sendZns({
        template,
        name,
        customers,
        _id,
        cb: (response) => {
          console.log("Response:", response);
        },
      });

      if (_id) {
        scheduledJobs.set(_id, job);
      }
    });
    console.log(`Lên lịch gửi vào: ${date}`);
  } else {
    sendZns({
      template,
      name,
      customers,
      _id,
      cb: (response) => {
        console.log("Response:", response);
      },
    });
  }
};
