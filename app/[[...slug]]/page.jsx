import Marketplace from "../../src/Marketplace";
export default async function Page({ params, searchParams }) {
  const routeParams = await params;
  const queryParams = await searchParams;
  const path = `/${(routeParams?.slug || []).join("/")}`;
  const query = Object.entries(queryParams || {})
    .flatMap(([key, values]) =>
      (Array.isArray(values) ? values : [values]).map(
        (value) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      ),
    )
    .join("&");
  return <Marketplace path={path} query={query} />;
}
