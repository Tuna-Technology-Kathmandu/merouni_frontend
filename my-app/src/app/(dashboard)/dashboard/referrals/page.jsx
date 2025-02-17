"use client";

import React, { useEffect, useState } from "react";
import { fetchReferrals } from "./action";
import ShimmerEffect from "@/app/components/ShimmerEffect";

const ReferralsPage = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReferrals = async () => {
      try {
        const data = await fetchReferrals();
        setReferrals(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadReferrals();
  }, []);

  if (loading) return <ShimmerEffect />;
  if (error)
    return (
      <p className="flex items-center justify-center text-center">
        Error: {error}
      </p>
    );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Referrals</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-4 py-2 border">Student Name</th>
              <th className="px-4 py-2 border">Applied College</th>
              <th className="px-4 py-2 border">Referred By</th>
              <th className="px-4 py-2 border">Student Email</th>
              <th className="px-4 py-2 border">Student Phone</th>
              <th className="px-4 py-2 border">Application Type</th>
            </tr>
          </thead>
          <tbody>
            {referrals.map((referral) =>
              referral.referralStudents.map((student) => (
                <tr key={student.id} className="border-b">
                  <td className="px-4 py-2 border">{student.student_name}</td>
                  <td className="px-4 py-2 border">
                    {referral.referralCollege.name}
                  </td>
                  <td className="px-4 py-2 border">
                    {referral.referralTeacher
                      ? `${referral.referralTeacher.firstName} ${
                          referral.referralTeacher.middleName || ""
                        } ${referral.referralTeacher.lastName}`.trim()
                      : "Self"}
                  </td>
                  <td className="px-4 py-2 border">{student.student_email}</td>
                  <td className="px-4 py-2 border">
                    {student.student_phone_no}
                  </td>
                  <td className="px-4 py-2 border">
                    {referral.application_type}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReferralsPage;
