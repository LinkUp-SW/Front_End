import React, { useCallback } from "react";
import SettingsLayoutPage from "@/components/hoc/SettingsLayoutPage";
import {
  cancelSubscription,
  getSubscriptionStatus,
  initiateSubscriptionSession,
  resumeSubscription,
} from "@/endpoints/subscriptions";
import useFetchData from "@/hooks/useFetchData";
import Cookies from "js-cookie";
import { Subscription } from "@/types";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errorHandler";

const formatDate = (d: Date | null | undefined): string =>
  d
    ? new Date(d).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

const statusColor = {
  active: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200",
  canceled: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200",
  trialing:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200",
  past_due:
    "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-200",
} as const;

const SubscriptionBillingPage: React.FC = () => {
  const token = Cookies.get("linkup_auth_token") || "";
  const {
    data: subData,
    loading,
    error,
    refetch,
  } = useFetchData<Subscription | null>(
    async () =>
      token ? (await getSubscriptionStatus(token)).subscription : null,
    []
  );

  const handleAction = useCallback(
    async (action: "cancel" | "resume" | "renew" | "subscribe") => {
      try {
        let res;
        if (action === "cancel") res = await cancelSubscription(token);
        if (action === "resume") res = await resumeSubscription(token);
        if (action === "renew" || action === "subscribe") {
          res = await initiateSubscriptionSession(token);
          return (window.location.href = res.url);
        }

        toast.success(res.message);
        setTimeout(refetch, 800);
      } catch (e) {
        toast.error(getErrorMessage(e));
      }
    },
    [token, refetch]
  );

  return (
    <SettingsLayoutPage>
      <div className="max-w-2xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-8">
          Billing & Subscription
        </h1>

        {loading && (
          <div className="space-y-4 animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/5" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        )}

        {!loading && error && (
          <p className="text-red-600 dark:text-red-400">
            Could not load subscription.
          </p>
        )}

        {!loading && !error && (
          <div className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden">
            {/* gradient accent */}
            <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <div className="p-6 space-y-6">
              {/* header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                    <span>
                      {subData?.plan === "premium"
                        ? "Premium Plan"
                        : "Free Plan"}
                    </span>
                    <span
                      className={`text-sm font-medium uppercase px-2 py-1 rounded-full ${
                        subData?.plan === "premium"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {subData?.plan || "free"}
                    </span>
                  </h2>
                  <span
                    className={`inline-block mt-1 text-sm font-medium uppercase px-2 py-0.5 rounded-full ${
                      subData
                        ? statusColor[subData.status]
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {subData
                      ? subData.status.replace("_", " ")
                      : "Not Subscribed"}
                  </span>
                </div>

                {/* action buttons */}
                <div className="flex flex-wrap gap-2">
                  {!subData?.subscribed && (
                    <button
                      onClick={() => handleAction("subscribe")}
                      className="flex items-center gap-1 px-5 py-2 affirmativeBtn text-sm font-medium rounded-xl focus:outline-none   transition"
                    >
                      {/* subscribe icon */}
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Subscribe
                    </button>
                  )}

                  {subData?.plan === "premium" &&
                    !subData.cancel_at_period_end && (
                      <button
                        onClick={() => handleAction("cancel")}
                        className="flex items-center gap-1 px-5 py-2 destructiveBtn text-sm font-medium rounded-xl focus:outline-none focus:ring-2 transition"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Cancel
                      </button>
                    )}

                  {(subData?.status === "canceled" ||
                    subData?.cancel_at_period_end) && (
                    <button
                      onClick={() => handleAction("resume")}
                      className="flex items-center gap-1 px-5 py-2 
               bg-emerald-500 hover:bg-emerald-600 
               text-white text-sm font-medium 
               rounded-xl focus:outline-none 
               focus:ring-2 focus:ring-emerald-300 
               transition"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Resume
                    </button>
                  )}

                  {(subData?.status === "past_due" ||
                    subData?.status === "trialing") && (
                    <button
                      onClick={() => handleAction("renew")}
                      className="flex items-center gap-1 px-5 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v6h6M20 20v-6h-6"
                        />
                      </svg>
                      {subData.status === "trialing" ? "Renew" : "Pay Due"}
                    </button>
                  )}
                </div>
              </div>

              {/* timeline */}
              {subData &&
                subData.current_period_start &&
                subData.current_period_end && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                      <span>{formatDate(subData.current_period_start)}</span>
                      <span>{formatDate(subData.current_period_end)}</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full relative overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{
                          width: `${
                            ((Date.now() -
                              new Date(
                                subData.current_period_start
                              ).getTime()) /
                              (new Date(subData.current_period_end).getTime() -
                                new Date(
                                  subData.current_period_start
                                ).getTime())) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )}

              {subData?.plan === "premium" && (
                <>
                  {/* details */}
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                    <div>
                      <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Started On
                      </dt>
                      <dd className="mt-1 text-gray-900 dark:text-gray-100">
                        {formatDate(subData?.subscription_started_at)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Ends On
                      </dt>
                      <dd className="mt-1 text-gray-900 dark:text-gray-100">
                        {formatDate(subData?.subscription_ends_at)}
                      </dd>
                    </div>

                    {subData?.canceled_at && (
                      <div>
                        <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Canceled At
                        </dt>
                        <dd className="mt-1 text-gray-900 dark:text-gray-100">
                          {formatDate(subData.canceled_at)}
                        </dd>
                      </div>
                    )}

                    <div>
                      <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Subscription ID
                      </dt>
                      <dd className="mt-1 text-gray-900 dark:text-gray-100 break-all">
                        {subData?.subscription_id || "—"}
                      </dd>
                    </div>
                  </dl>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </SettingsLayoutPage>
  );
};

export default SubscriptionBillingPage;
