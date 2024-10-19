// import axios from "axios";
// import nodeCron from "node-cron";
// import { Campaign } from "../../models/campaign.Model";
// import { readTokenFromFile } from "./zaloJobTokenService";

// export const scheduledJobs = new Map<string, nodeCron.ScheduledTask>();

// export const sendZns = async ({
//   template,
//   customers,
//   _id,

//   cb,
// }: {
//   template: string;
//   customers: any[];
//   _id?: string;

//   cb: (response: { template: string; customers: any[] }) => void;
// }) => {
//   const { access_token } = readTokenFromFile();
//   const url = "https://business.openapi.zalo.me/message/template";

//   const templateDataMap = {
//     "366532": (customer: any) => ({
//       order_date: "20/03/2020",
//       customer_name: customer.name,
//       order_code: "PE010299485",
//     }),
//     "366485": (customer: any) => ({
//       customer_name: customer.name,
//       tuition_code: "PE010299485",
//       price_number: "1000",
//       custom_date: "20/03/2020",
//       order_code: "PE010299cv485",
//     }),
//   };

//   const customerResults: any[] = [];

//   await Promise.all(
//     customers.map(async (customer) => {
//       const templateData =
//         templateDataMap[template as keyof typeof templateDataMap](customer);

//       const requestData = {
//         phone: customer.phone,
//         template_id: template,
//         template_data: templateData,
//         tracking_id: "tracking_id",
//       };

//       const sendTime = new Date();

//       try {
//         const response = await axios.post(url, requestData, {
//           headers: {
//             "Content-Type": "application/json",
//             access_token,
//           },
//         });
//         const isSuccess = response.data.error === 0;
//         customerResults.push({
//           template: template,
//           name: customer.name,
//           phone: customer.phone,
//           createdAt: sendTime,
//           status: isSuccess ? "success" : "failure",
//         });
//       } catch (error) {
//         console.error(
//           `Error sending ZNS for phone ${customer.phone}:`,
//           error || error
//         );
//         customerResults.push({
//           template: template,
//           name: customer.name,
//           phone: customer.phone,
//           createdAt: sendTime,
//           status: "failure",
//         });
//       }
//     })
//   );

//   if (_id) {
//     try {
//       const existingCampaign = await Campaign.findById(_id);

//       const updatedCustomerResults = [
//         ...(existingCampaign?.customer_results || []),
//         ...customerResults,
//       ];

//       await Campaign.findByIdAndUpdate(_id, {
//         $set: { customer_results: updatedCustomerResults },
//       });
//     } catch (err) {
//       console.error(`Failed to update campaign ${_id}:`, err);
//     }
//   }
//   cb({ template, customers: customerResults });
// };

// export const scheduleZns = ({
//   template,
//   customers,
//   startAt,
//   _id,
// }: {
//   template: string;
//   customers: any[];
//   startAt: Date | string;
//   _id?: string;
// }) => {
//   const date = new Date(startAt);
//   const now = new Date();

//   if (date > now) {
//     const cronTime = `${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${
//       date.getMonth() + 1
//     } *`;

//     const job = nodeCron.schedule(cronTime, () => {
//       sendZns({
//         template,
//         customers,
//         _id,
//         cb: (response) => {
//           console.log("Response:", response);
//         },
//       });

//       if (_id) {
//         scheduledJobs.set(_id, job);
//       }
//     });
//     console.log(`Lên lịch gửi vào: ${date}`);
//   } else {
//     sendZns({
//       template,
//       customers,
//       _id,
//       cb: (response) => {
//         console.log("Response:", response);
//       },
//     });
//   }
// };

import axios from "axios";
import nodeCron from "node-cron";
import { Campaign } from "../../models/campaign.Model";
import { readTokenFromFile } from "./zaloJobTokenService";

export const scheduledJobs = new Map<string, nodeCron.ScheduledTask>();

// Hàm lấy dữ liệu mẫu từ API
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
  customers,
  _id,
  cb,
}: {
  template: string;
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

  const customerResults: any[] = [];

  await Promise.all(
    customers.map(async (customer) => {
      const templateData: any = {};
      console.log("người dùng",customer);
      // Loop through each template field and populate from customer data
      Object.keys(templateFields).forEach((field) => {
        templateData[field] = customer[field] || "N/A"; // Populate from customer or fallback to 'N/A'
      });

      const requestData = {
        phone: customer.phone,
        template_id: template,
        template_data: templateData,
        tracking_id: "tracking_id", // Custom tracking if required
      };

      console.log("Sending ZNS data:", requestData);

      const sendTime = new Date();

      try {
        const response = await axios.post(url, requestData, {
          headers: {
            "Content-Type": "application/json",
            access_token,
          },
        });
        const isSuccess = response.data.error === 0;
        customerResults.push({
          template: template,
          name: customer.name,
          phone: customer.phone,
          createdAt: sendTime,
          status: isSuccess ? "success" : "failure",
        });
      } catch (error) {
        console.error(`Error sending ZNS for phone ${customer.phone}:`, error);
        customerResults.push({
          template: template,
          name: customer.name,
          phone: customer.phone,
          createdAt: sendTime,
          status: "failure",
        });
      }
    })
  );

  // Update the campaign with results if a campaign ID is provided
  if (_id) {
    try {
      const existingCampaign = await Campaign.findById(_id);
      const updatedCustomerResults = [
        ...(existingCampaign?.customer_results || []),
        ...customerResults,
      ];

      await Campaign.findByIdAndUpdate(_id, {
        $set: { customer_results: updatedCustomerResults },
      });
    } catch (err) {
      console.error(`Failed to update campaign ${_id}:`, err);
    }
  }

  // Call the callback with the results
  cb({ template, customers: customerResults });
};

export const scheduleZns = ({
  template,
  customers,
  startAt,
  _id,
}: {
  template: string;
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
      customers,
      _id,
      cb: (response) => {
        console.log("Response:", response);
      },
    });
  }
};

/* 
import axios from "axios";
import nodeCron from "node-cron";
import { readTokenFromFile } from "./zaloJobTokenService";

export const scheduledJobs = new Map<string, nodeCron.ScheduledTask>();

export const sendZns = async ({
  template,
  customers,
  cb,
}: {
  template: string;
  customers: any[];
  cb: (response: { template: string; customers: any[] }) => void;
}) => {
  const { access_token } = readTokenFromFile();
  const url = "https://business.openapi.zalo.me/message/template";

  const templateDataMap = {
    "366532": (customer: any) => ({
      order_date: "20/03/2020",
      customer_name: customer.name,
      order_code: "PE010299485",
    }),
    "366485": (customer: any) => ({
      customer_name: customer.name,
      tuition_code: "PE010299485",
      price_number: "1000",
      custom_date: "20/03/2020",
      order_code: "PE010299cv485",
    }),
  };

  const customerResults: any[] = [];

  await Promise.all(
    customers.map(async (customer) => {
      const templateData =
        templateDataMap[template as keyof typeof templateDataMap](customer);

      const requestData = {
        phone: customer.phone,
        template_id: template,
        template_data: templateData,
        tracking_id: "tracking_id",
      };

      try {
        const response = await axios.post(url, requestData, {
          headers: {
            "Content-Type": "application/json",
            access_token,
          },
        });
        const isSuccess = response.data.error === 0;
        customerResults.push({
          name: customer.name,
          phone: customer.phone,
          status: isSuccess ? "success" : "failure",
        });
      } catch (error) {
        console.error(
          `Error sending ZNS for phone ${customer.phone}:`,
          error || error
        );
        customerResults.push({
          name: customer.name,
          phone: customer.phone,
          status: "failure",
        });
      }
    })
  );

  cb({ template, customers: customerResults });
};

export const scheduleZns = ({
  template,
  customers,
  startAt,
  campaignId,
}: {
  template: string;
  customers: any[];
  startAt: Date | string;
  campaignId?: string;
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
        customers,
        cb: (response) => {
          console.log("Response:", response);
        },
      });

      if (campaignId) {
        scheduledJobs.set(campaignId, job);
      }
    });
    console.log(`Lên lịch gửi vào: ${date}`);
  } else {
    sendZns({
      template,
      customers,
      cb: (response) => {
        console.log("Response:", response);
      },
    });
  }
}; */
