import "./globals.css";
export const metadata = {
  title: "RentWheels — Find your perfect ride",
  description: "Browse cars, bikes and more with RentWheels.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try { document.documentElement.dataset.theme = localStorage.getItem("rentwheels-theme") === "dark" ? "dark" : "light"; } catch (_) {}`,
          }}
        />
      </head>
      <body className="overflow-y-scroll font-sans">{children}</body>
    </html>
  );
}
