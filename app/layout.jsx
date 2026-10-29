import "./globals.css";
export const metadata = {
  title: "RentWheels — Find your perfect ride",
  description: "Browse cars, bikes and more with RentWheels.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="overflow-y-scroll font-sans">{children}</body>
    </html>
  );
}
