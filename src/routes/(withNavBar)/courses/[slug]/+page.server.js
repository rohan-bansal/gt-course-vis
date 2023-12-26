export async function load({ params, url }) {
  console.log(params.slug);
  return {
    title: params.slug,
  };
}
