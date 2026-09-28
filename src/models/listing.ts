import mongoose, { Schema, Document, Model } from "mongoose";

export type ListingStatus = "draft" | "pending" | "published" | "rejected";

export interface IListing extends Document {
    title: string;
    description: string;
    category: string;
    phone: string;
    whatsapp?: string;
    website?: string;
    address: string;
    city: string;
    province: string;
    logo?: string;
    images: string[];
    userId: string;
    status: ListingStatus;
    views: number;
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ListingSchema = new Schema<IListing>(
    {
        title: {
            type: String,
            required: [true, "عنوان آگهی الزامی است"],
            trim: true,
            minlength: [3, "عنوان باید حداقل ۳ کاراکتر باشد"],
            maxlength: [100, "عنوان نمی‌تواند بیش از ۱۰۰ کاراکتر باشد"],
        },
        description: {
            type: String,
            required: [true, "توضیحات الزامی است"],
            trim: true,
            minlength: [20, "توضیحات باید حداقل ۲۰ کاراکتر باشد"],
            maxlength: [5000, "توضیحات نمی‌تواند بیش از ۵۰۰۰ کاراکتر باشد"],
        },
        category: {
            type: String,
            required: [true, "دسته‌بندی الزامی است"],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, "شماره تماس الزامی است"],
            trim: true,
        },
        whatsapp: {
            type: String,
            trim: true,
        },
        website: {
            type: String,
            trim: true,
        },
        address: {
            type: String,
            required: [true, "آدرس الزامی است"],
            trim: true,
            maxlength: [500, "آدرس نمی‌تواند بیش از ۵۰۰ کاراکتر باشد"],
        },
        city: {
            type: String,
            required: [true, "شهر الزامی است"],
            trim: true,
        },
        province: {
            type: String,
            required: [true, "استان الزامی است"],
            trim: true,
        },
        logo: {
            type: String,
            trim: true,
        },
        images: {
            type: [String],
            default: [],
        },
        userId: {
            type: String,
            required: [true, "کاربر سازنده الزامی است"],
            index: true,
        },
        status: {
            type: String,
            enum: ["draft", "pending", "published", "rejected"],
            default: "draft",
        },
        views: {
            type: Number,
            default: 0,
        },
        featured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true, // createdAt + updatedAt خودکار
    }
);

// ایندکس برای جستجوی سریع‌تر
ListingSchema.index({ status: 1, createdAt: -1 });
ListingSchema.index({ city: 1, category: 1 });
ListingSchema.index({ title: "text", description: "text" }); // جستجوی متنی

// جلوگیری از ساخت مجدد مدل در hot reload
const Listing: Model<IListing> =
  mongoose.models.Listing ||
  mongoose.model<IListing>("Listing", ListingSchema);

export default Listing;