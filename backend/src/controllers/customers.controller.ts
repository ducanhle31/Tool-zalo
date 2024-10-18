import { Request, Response } from "express";
import fs from "fs";
import { ObjectId } from "mongodb";
import { flatten, unflatten } from "safe-flat";
import xlsx from "xlsx";
import { Customer } from "../models/customer.Model";
import { Transaction } from "../models/transaction.Model";
import { Wallet } from "../models/wallet.Model";

class CustomersController {
  public async get(req: Request, res: Response) {
    try {
      const customers = await Customer.find().sort({ createdAt: -1 });

      return res.json({
        customers,
        total: customers?.length || 0,
        ok: true,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }

  public async getDetail(req: Request, res: Response) {
    const id = req.params.id;

    try {
      const customer = await Customer.findById(id)
        .populate("customer_groups")
        .populate("wallet")
        .populate("facilities")
        .populate("user");
      return res.json({ customer, ok: true });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }

  public async create(req: Request, res: Response) {
    const customer = req.body;

    const name = customer?.name;
    const phone = customer?.phone;
    const status = customer?.status || "active";
    const addressCountry = customer?.address?.country;
    const addressProvince = customer?.address?.province;
    const addressDistrict = customer?.address?.district;
    const addressTown = customer?.address?.town;
    const gender = customer?.gender;
    const birth = new Date(customer?.birth);
    const is_follow_oa = Boolean(customer?.is_follow_oa);

    const wallet = customer?.wallet
      ? new ObjectId(customer?.wallet! as string)
      : null;
    const user = customer?.user
      ? new ObjectId(customer?.user! as string)
      : null;
    const facilities = customer?.facilities
      ? customer?.facilities?.map((fac: string) => new ObjectId(fac))
      : null;
    const customerGroups =
      customer?.customer_groups && customer?.customer_groups?.length
        ? customer?.customer_groups?.map((gr: string) => new ObjectId(gr))
        : null;

    if (
      !name ||
      !phone ||
      !addressCountry ||
      !addressDistrict ||
      !addressProvince ||
      !addressTown ||
      !gender ||
      !birth
    ) {
      return res.json({
        error: "Thiếu thông tin tạo khách hàng",
        error_type: "require",
      });
    }

    try {
      const customerSame = await Customer.findOne({ phone });
      if (customerSame) {
        return res.status(500).json({
          error: "Trùng thông tin liên hệ số điện thoại!",
          error_type: "same",
        });
      }
      const result = await Customer?.insertMany({
        ...customer,
        name,
        phone,
        wallet,
        user,
        facilities,
        birth,
        customerGroups,
        is_follow_oa,
        status,
      });

      return res.json({ result, ok: true });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }

  public async import(req: Request, res: Response) {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Không có file nào được upload" });
    }

    const results: any[] = [];

    const fileExtension = file?.originalname?.split(".")?.pop()?.toLowerCase();

    if (fileExtension !== "xlsx")
      return res.status(500).json({ error: "File không được hỗ trợ" });

    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const data = xlsx.utils.sheet_to_json(worksheet);

    data.forEach((item: any) => {
      const customer = unflatten(item);
      results.push(customer);
    });

    fs.unlinkSync(file.path);

    handleBulk(results);

    async function handleBulk(customers: any[]) {
      if (!Array.isArray(customers)) {
        return res
          .status(400)
          .json({ error: "Invalid data format. Expected an array." });
      }

      const errors: any[] = [];
      const bulkOperations: any[] = [];

      const phoneConflicts: any[] = [];
      const idConflicts: any[] = [];

      const phoneSet = new Set();
      const idSet = new Set();

      for (const [index, customer] of customers.entries()) {
        try {
          const name = customer?.name;
          const phone = customer?.phone;
          const addressCountry = customer?.address?.country;
          const addressProvince = customer?.address?.province;
          const addressDistrict = customer?.address?.district;
          const addressTown = customer?.address?.town;
          const gender = customer?.gender;
          const birth = customer?.birth;

          const wallet = new ObjectId(customer?.wallet! as string);
          const user = new ObjectId(customer?.user! as string);
          const facilities = customer?.facilities?.map(
            (fac: string) => new ObjectId(fac)
          );
          const customerGroups = customer?.customer_groups?.map(
            (gr: string) => new ObjectId(gr)
          );

          customer.wallet = wallet;
          customer.user = user;
          customer.facilities = facilities;
          customer.customerGroups = customerGroups;
          customer.is_follow_oa = Boolean(customer.is_follow_oa);
          customer.birth = new Date(customer.birth);

          if (!name || !phone || !gender) {
            errors.push({
              row: index + 1,
              error: "Thiếu trường thông tin bắt buộc",
              error_type: "format",
            });
            continue;
          }

          if (customer._id && idSet.has(customer._id)) {
            idConflicts.push({
              row: index + 1,
              id: customer._id,
              error: "Trùng lặp ID trong dữ liệu truyền lên",
            });
            continue;
          } else if (customer._id) {
            idSet.add(customer._id);
          }

          if (phoneSet.has(phone)) {
            phoneConflicts.push({
              row: index + 1,
              phone,
              error: "Trùng lặp số điện thoại trong dữ liệu truyền lên",
            });
            continue;
          } else {
            phoneSet.add(phone);
          }

          if (customer._id) {
            const existingCustomer = await Customer.findById(customer._id);

            if (existingCustomer) {
              bulkOperations.push({
                updateOne: {
                  filter: { _id: new ObjectId(customer._id) },
                  update: { $set: customer },
                },
              });
            } else {
              bulkOperations.push({
                insertOne: {
                  document: { ...customer, _id: new ObjectId(customer._id) },
                },
              });
            }
          } else {
            const existingCustomerWithPhone = await Customer.findOne({
              phone,
            });

            if (existingCustomerWithPhone) {
              phoneConflicts.push({
                row: index + 1,
                phone,
                error: "Số điện thoại đã tồn tại trên hệ thống",
              });
            } else {
              bulkOperations.push({
                insertOne: {
                  document: customer,
                },
              });
            }
          }
        } catch (error: any) {
          errors.push({
            row: index + 1,
            error: error?.message,
          });
        }
      }

      if (
        errors.length > 0 ||
        phoneConflicts.length > 0 ||
        idConflicts.length > 0
      ) {
        console.log(errors, phoneConflicts, idConflicts);
        return res.status(500).json({
          error: "Validation failed",
          errors: errors,
          phoneConflicts: phoneConflicts,
          idConflicts: idConflicts,
        });
      } else {
        try {
          if (bulkOperations.length > 0) {
            const result = await Customer.bulkWrite(bulkOperations);

            return res.json({
              message: "Bulk import successful",
              phoneConflicts,
              idConflicts,
              result,
              ok: true,
            });
          }
        } catch (error) {
          console.log(error);
          return res.status(500).json({ message: "Bulk import failed", error });
        }
      }
    }
  }

  public async exportTemplate(req: Request, res: Response) {
    const customers = [
      {
        name: "Pham Thi D",
        phone: "0923456789",
        email: "phamthid@example.com",
        is_follow_oa: true,
        address: {
          country: "Vietnam",
          province: "Hai Phong",
          district: "Le Chan",
          town: "Hang Kenh",
          free_note: "Near the stadium",
        },
        wallet: "6502e38552f4a15d4c7edc37",
        user: "6502e3a952f4a15d4c7edc3a",
        facilities: ["6502e3c752f4a15d4c7edc3d", "6502e3eb52f4a15d4c7edc40"],
        customer_groups: ["6502e40f52f4a15d4c7edc43"],
        status: "inactive",
        metadata: {
          test: "",
          loyalty_level: "",
          notes: "",
        },
        birth: "1978-12-30",
        gender: "female",
      },
    ];

    const formattedCustomers = customers.map((customer) => flatten(customer));

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(formattedCustomers);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Customers");

    const filePath = "exports/customers.xlsx";
    xlsx.writeFile(workbook, filePath);

    res.download(filePath, "customers.xlsx", (err) => {
      if (err) {
        res.status(500).send({ error: "Failed to export data" });
      }

      fs.unlinkSync(filePath);
    });
  }

  public async export(req: Request, res: Response) {
    const customers = req.body as any[];
    const formattedCustomers = customers.map((customer) => flatten(customer));

    const worksheet = xlsx.utils.json_to_sheet(formattedCustomers);

    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Customers");

    const filePath = "exports/customers.xlsx";

    xlsx.writeFile(workbook, filePath);

    res.download(filePath, "customers.xlsx", (err) => {
      if (err) {
        return res.status(500).send({ error: "Failed to export data" });
      }

      fs.unlinkSync(filePath);
    });
  }

  public async update(req: Request, res: Response) {
    const _id = req?.params?.id;
    const customerUpdate = req.body;
    delete customerUpdate?._id;

    if (!_id)
      return res.status(500).json({ error: "Không có tham số _id truyền lên" });

    try {
      const result = await Customer.findOneAndUpdate(
        { _id },
        { ...customerUpdate }
      );

      if (result) return res.status(200).json({ customer: result, ok: true });

      return res
        .status(500)
        .json({ error: "Không tìm thấy customer cần update" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Lỗi khi update customer" });
    }
  }

  public async delete(req: Request, res: Response) {
    const _id = req?.params?.id;

    if (!_id)
      return res.status(500).json({ error: "Không có tham số _id truyền lên" });

    try {
      const currentCustomer = await Customer.findById(_id);
      if (!currentCustomer) {
        return res
          .status(500)
          .json({ error: "Không tìm thấy customer cần xóa" });
      }

      const walletId = currentCustomer.wallet;

      const wallet = await Wallet.findById(walletId);

      if (wallet && wallet?.current_balance === 0) {
        await Wallet.deleteOne({ _id: walletId });
        await Transaction.deleteMany({ wallet: walletId });
      }

      if (wallet && wallet.current_balance) {
        console.error(
          "Không thể xóa khách hàng vì số dư thẻ thành viên lơn hơn 0đ"
        );
        return res.status(500).json({
          error: "Không thể xóa khách hàng vì số dư thẻ thành viên lơn hơn 0đ",
        });
      }

      const result = await Customer.findOneAndDelete({ _id });

      if (result) return res.status(200).json({ customer: result, ok: true });
      return res.status(500).json({ error: "Không tìm thấy customer cần xóa" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Lỗi khi update customer" });
    }
  }

  public async deleteBulk(req: Request, res: Response) {
    const ids = req.body as string[];

    const objectIds = ids?.map((id: string) => new ObjectId(id)) || null;

    if (!ids || !ids?.length)
      return res.status(500).json({ error: "Không có tham số id truyền lên" });

    try {
      const result = await Customer.deleteMany({ _id: { $in: objectIds } });
      return res.status(200).json({ result, ok: true });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Lỗi khi xóa danh sách customer" });
    }
  }
}

export default new CustomersController();
