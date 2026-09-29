import mongoose, { Schema, Document, Model } from "mongoose";
import { Doc } from "zod/v4/core";

export type SubscriptionStatus = "active" | "expired" | "cancelled";

export interface ISubscription extends Document {
    userId: string;
    planId: mongoose.Types.ObjectId;
    planSlug: string;
    status: SubscriptionStatus;
    startsAt: Date;
    expiresAt: Date;
    // برای پرداخت
    paymentId?: string;
    paymentAmount?: number;
    paymentStatus?: "pending" | "paid" | "failed";
    createdAt: Date;
    updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        planId: {
            type: Schema.Types.ObjectId,
            ref: "Plan",
            required: true,
        },
        planSlug: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "expired", "cancelled"],
            default: "active",
        },
        startsAt: {
            type: Date,
            default: Date.now,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: true,
        },
        paymentId: {
            type: String,
            trim: true,
        },
        paymentAmount: {
            type: Number,
            min: 0,
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "paid", // پکیج رایگان خودکار paid هست
        },
    },
    { timestamps: true }
);

SubscriptionSchema.index({ userId: 1, status: 1, expiresAt: -1 });

const Subscription: Model<ISubscription> =
  mongoose.models.Subscription ||
  mongoose.model<ISubscription>("Subscription", SubscriptionSchema);
  
export default Subscription;
