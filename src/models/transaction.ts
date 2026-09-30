// src/models/transaction.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export type TransactionStatus = "pending" | "paid" | "failed" | "cancelled";

export interface ITransaction extends Document {
    userId: string;
    planId: mongoose.Types.ObjectId;
    planSlug: string;
    amount: number;
    invoiceNumber: string;
    urlId: string;           // 👈 جدید (مقدار دریافتی از purchase)
    status: TransactionStatus;
    createdAt: Date;
    updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
    {
        userId: {
            type: String,
            required: true,
            index: true
        },
        planId: {
            type: Schema.Types.ObjectId,
            ref: "Plan",
            required: true
        },
        planSlug: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        invoiceNumber: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        urlId: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "paid", "failed", "cancelled"],
            default: "pending",
        },
    },
    { timestamps: true }
);

TransactionSchema.index({ userId: 1, status: 1 });

const Transaction: Model<ITransaction> =
    mongoose.models.Transaction ||
    mongoose.model<ITransaction>("Transaction", TransactionSchema);

export default Transaction;