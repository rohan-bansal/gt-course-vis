export async function load({ params, url }) {
  console.log(url);
  return {
    title: params.slug,
  };
}
