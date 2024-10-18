import axios from "axios";
import fs from "fs";
import cron from "node-cron";
import path from "path";

const tokenFilePath = path.join(__dirname, "./token.json");
const dataFilePath = path.join(__dirname, "./datasendzns.json");

export const readData = (): any[] => {
  try {
    const rawData = fs.readFileSync(dataFilePath, {
      encoding: "utf8",
      flag: "r+",
    });

    if (!rawData) {
      throw new Error("File is empty.");
    }

    const parsedData = JSON.parse(rawData);

    if (!Array.isArray(parsedData)) {
      throw new Error("Parsed data is not an array.");
    }

    console.log("Data read successfully.");
    return parsedData;
  } catch (error) {
    console.error("Error reading or parsing JSON data:", error);
    return [];
  }
};

// Đọc token từ file
export const readTokenFile = (): { access_token: string } => {
  try {
    const data = fs.readFileSync(tokenFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading token file:", error);
    return { access_token: "" };
  }
};

// Hàm gửi ZNS cho templateId 366532
export const sendZNSForTemplate366532 = async (
  customer: any,
  accessToken: string
) => {
  const url = "https://business.openapi.zalo.me/message/template";
  const requestData = {
    phone: customer.phone,
    template_id: "366532",
    template_data: {
      order_date: customer.order_date,
      customer_name: customer.customer_name,
      order_code: customer.order_code,
    },
    tracking_id: "tracking_id",
  };

  try {
    const response = await axios.post(url, requestData, {
      headers: {
        "Content-Type": "application/json",
        access_token: accessToken,
      },
    });
    return response.data.error === 0 ? "success" : "failure";
  } catch (error) {
    console.error(`Error sending ZNS for order: ${customer.order_code}`, error);
    return "failure";
  }
};

// Hàm gửi ZNS cho templateId 366485
export const sendZNSForTemplate366485 = async (
  customer: any,
  accessToken: string
) => {
  const url = "https://business.openapi.zalo.me/message/template";
  const requestData = {
    phone: customer.phone,
    template_id: "366485",
    template_data: {
      customer_name: customer.customer_name,
      tuition_code: customer.tuition_code,
      price_number: customer.price_number,
      custom_date: customer.custom_date,
      order_code: customer.order_code,
    },
    tracking_id: "tracking_id",
  };

  try {
    const response = await axios.post(url, requestData, {
      headers: {
        "Content-Type": "application/json",
        access_token: accessToken,
      },
    });
    return response.data.error === 0 ? "success" : "failure";
  } catch (error) {
    console.error(
      `Error sending ZNS for tuition code: ${customer.tuition_code}`,
      error
    );
    return "failure";
  }
};

// Hàm gửi UID message
export const sendUIDMessage = async (customer: any, accessToken: string) => {
  const url = "https://openapi.zalo.me/v3.0/oa/message/promotion";
  const requestData = {
    recipient: {
      user_id: customer.customers, // user_id trong trường customers
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "promotion",
          elements: [
            {
              image_url:
                "https://dec.neu.edu.vn/_next/image?url=https%3A%2F%2Fdecneu.aum.edu.vn%2Fwp-content%2Fuploads%2F2024%2F07%2Fdai-hoc-ke-toan-1-.jpg&w=384&q=75",
              type: "banner",
            },
            {
              type: "header",
              content: "💥💥Xác nhận tham gia Khai giảng💥💥",
            },
            {
              type: "text",
              align: "left",
              content: `Thông báo lịch khai giảng đến ${customer.customer_name} `,
            },
            {
              type: "table",
              content: [
                { value: "VC09279222", key: "Voucher" },
                { value: "30/12/2023", key: "Ngày khai giảng" },
              ],
            },
            {
              type: "text",
              align: "center",
              content: "Áp dụng tất cả cửa hàng trên toàn quốc",
            },
          ],
          buttons: [
            {
              title: "Xác nhận tham gia",
              image_icon: "",
              type: "oa.open.url",
              payload: {
                // url: "https://zalo.me/s/3182440549912743286/form?env=TESTING&version=11",
                url: "https://zalo.me/s/3182440549912743286/form",
              },
            },
            {
              title: "Liên hệ chăm sóc viên",
              image_icon: "",
              type: "oa.open.url",
              payload: {
                url: "https://zalo.me/s/3182440549912743286/form?env=TESTING&version=16",
                // url: "https://zalo.me/s/3182440549912743286/form",
              },
            },
          ],
        },
      },
    },
  };

  try {
    const response = await axios.post(url, requestData, {
      headers: {
        "Content-Type": "application/json",
        access_token: accessToken,
      },
    });
    return response.data.error === 0 ? "success" : "failure";
  } catch (error) {
    console.error(
      `Error sending UID message for customer: ${customer.customer_name}`,
      error
    );
    return "failure";
  }
};

// Hàm gửi tin ZNS và cập nhật trạng thái

const sendZNS = async (customer: any, campaign: any, accessToken: string) => {
  if (campaign.campaign_type === "ZNS") {
    switch (campaign.templateId) {
      case "366532":
        return await sendZNSForTemplate366532(customer, accessToken);
      case "366485":
        return await sendZNSForTemplate366485(customer, accessToken);
      default:
        console.error(`Unknown templateId: ${campaign.templateId}`);
        return "failure";
    }
  } else if (campaign.campaign_type === "UID") {
    return await sendUIDMessage(customer, accessToken);
  }
};

// Hàm cập nhật file JSON
const updateDataFile = (updatedData: any[]) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(updatedData, null, 2), "utf8");
};

let debounceTimer: NodeJS.Timeout | null = null;

fs.watch(dataFilePath, (eventType: string, filename: string | null) => {
  if (filename && eventType === "change") {
    console.log("Detected changes in datasendzns.json, rescheduling ZNS...");

    // Clear the existing debounce timer if there is one
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set a new debounce timer (e.g., 500 ms)
    debounceTimer = setTimeout(() => {
      scheduleZNS(); // Re-run scheduling when file changes
      debounceTimer = null; // Reset the timer after execution
    }, 500);
  }
});

export const scheduleZNS = async () => {
  try {
    const data = await readData(); // Đọc tất cả chiến dịch từ file
    const { access_token } = readTokenFile(); // Lấy access_token từ file tokens.json

    if (!access_token) {
      console.error("No access token found. Cannot schedule ZNS.");
      return;
    }

    // Lặp qua từng chiến dịch
    data.forEach(async (campaign) => {
      if (campaign.status === "success") {
        console.log(
          `Campaign ${campaign.campaign_name} has already been sent successfully. Skipping.`
        );
        return;
      }

      if (campaign.sendMode === "immediate") {
        const sendPromises = campaign.customers.map(async (customer: any) => {
          const status = await sendZNS(customer, campaign, access_token);
          return { ...customer, status };
        });

        const updatedCustomers = await Promise.all(sendPromises);
        const successfulRequests = updatedCustomers.filter(
          (c: any) => c.status === "success"
        ).length;

        const updatedCampaign = {
          ...campaign,
          customers: updatedCustomers,
          status: "success",
          total_successful_requests: successfulRequests,
        };

        const campaignIndex = data.findIndex(
          (c: any) => c.campaign_id === campaign.campaign_id
        );
        if (campaignIndex !== -1) {
          data[campaignIndex] = updatedCampaign;
        }

        updateDataFile(data);

        console.log(
          `All messages for immediate campaign ${campaign.campaign_name} have been sent.`
        );
        return;
      }

      // Nếu không phải "immediate", lên lịch cron như bình thường
      const sendDate = new Date(campaign.campaign_time);
      const cronTime = `${sendDate.getMinutes()} ${sendDate.getHours()} ${sendDate.getDate()} ${
        sendDate.getMonth() + 1
      } *`;

      cron.schedule(
        cronTime,
        async () => {
          const sendPromises = campaign.customers.map(async (customer: any) => {
            const status = await sendZNS(customer, campaign, access_token);
            return { ...customer, status };
          });

          const updatedCustomers = await Promise.all(sendPromises);
          const successfulRequests = updatedCustomers.filter(
            (c: any) => c.status === "success"
          ).length;

          const updatedCampaign = {
            ...campaign,
            customers: updatedCustomers,
            status: "success",
            total_successful_requests: successfulRequests,
          };

          const campaignIndex = data.findIndex(
            (c: any) => c.campaign_id === campaign.campaign_id
          );
          if (campaignIndex !== -1) {
            data[campaignIndex] = updatedCampaign;
          }

          updateDataFile(data);

          console.log(
            `All messages for campaign ${campaign.campaign_name} have been sent.`
          );
        },
        {
          scheduled: true,
          timezone: "Asia/Ho_Chi_Minh",
        }
      );

      console.log(`Scheduled messages for time ${cronTime}`);
    });
  } catch (error) {
    console.error("Error scheduling ZNS:", error);
  }
};
