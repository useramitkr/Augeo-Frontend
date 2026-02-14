"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { orderAPI, paymentAPI } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";
import { CreditCard, Shield, CheckCircle, MapPin } from "lucide-react";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    orderAPI
      .getById(params.orderId as string)
      .then((res) => setOrder(res.data.data))
      .catch(() => toast.error("Order not found"))
      .finally(() => setIsLoading(false));
  }, [params.orderId, isAuthenticated, router]);

  const handlePayment = async () => {
    setIsPaying(true);
    try {
      const address = user?.addresses?.[selectedAddress];
      if (address) {
        await orderAPI.getById(order._id); // Ensure we have latest
      }
      const res = await paymentAPI.createPaymentIntent(order._id);
      // In production, use Stripe Elements here
      toast.success("Payment initiated! Redirecting...");
      setTimeout(() => router.push(`/dashboard/orders/${order._id}`), 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Payment failed");
    } finally {
      setIsPaying(false);
    }
  };

  if (isLoading)
    return (
      <>
        <PageLoader />
      </>
    );
  if (!order)
    return (
      <>
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-gray-500">Order not found</p>
        </div>
      </>
    );

  return (
    <>
      <div className="bg-dark py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold text-white">
            Checkout
          </h1>
          <p className="text-gray-400 mt-1">Order {order.orderNumber}</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="card p-6">
              <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gold" /> Shipping Address
              </h3>
              {user?.addresses && user.addresses.length > 0 ? (
                <div className="space-y-3">
                  {user.addresses.map((addr, i) => (
                    <label
                      key={i}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer ${selectedAddress === i ? "border-gold bg-gold/5" : "border-gray-200"}`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress === i}
                        onChange={() => setSelectedAddress(i)}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-medium text-sm">{addr.label}</p>
                        <p className="text-sm text-gray-600">
                          {addr.street}, {addr.city}, {addr.state}{" "}
                          {addr.zipCode}, {addr.country}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  No addresses saved. Please add an address in your profile
                  settings.
                </p>
              )}
            </div>

            {/* Payment */}
            <div className="card p-6">
              <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-gold" /> Payment
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600">
                  Secure payment powered by Stripe. Your payment information is
                  encrypted and never stored on our servers.
                </p>
              </div>
              <button
                onClick={handlePayment}
                disabled={isPaying || order.paymentStatus === "paid"}
                className="btn-primary w-full !py-4 text-lg disabled:opacity-50"
              >
                {order.paymentStatus === "paid"
                  ? "Already Paid"
                  : isPaying
                    ? "Processing..."
                    : `Pay ${formatCurrency(order.totalAmount)}`}
              </button>
              <p className="text-xs text-center text-gray-500 mt-2 flex items-center justify-center gap-1">
                <Shield className="h-3 w-3" /> Secure & encrypted payment
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="card p-6 h-fit lg:sticky lg:top-24">
            <h3 className="font-heading font-semibold text-lg mb-4">
              Order Summary
            </h3>
            {order.lot && (
              <div className="mb-4 pb-4 border-b">
                <p className="font-medium text-sm">
                  {typeof order.lot === "object" ? order.lot.title : "Lot Item"}
                </p>
              </div>
            )}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Hammer Price</span>
                <span className="font-medium">
                  {formatCurrency(order.hammerPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Buyer&apos;s Premium ({order.buyersPremiumRate}%)
                </span>
                <span className="font-medium">
                  {formatCurrency(order.buyersPremium)}
                </span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax</span>
                  <span className="font-medium">
                    {formatCurrency(order.tax)}
                  </span>
                </div>
              )}
              {order.shippingCost > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium">
                    {formatCurrency(order.shippingCost)}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t text-base font-bold">
                <span>Total</span>
                <span className="text-gold">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
            {order.paymentStatus === "paid" && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-700 text-sm font-medium">
                  Payment Complete
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
