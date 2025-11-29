export const metadata = {
  title: "ConnectMeUltimate",
  description: "Universal connection app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
