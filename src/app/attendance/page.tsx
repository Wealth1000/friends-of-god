import type { Metadata } from "next";

import { AttendanceView } from "@/components/attendance-view";

export const metadata: Metadata = {
  title: "Attendance — Friends of God",
  robots: { index: false, follow: false },
};

export default function AttendancePage() {
  return <AttendanceView />;
}
