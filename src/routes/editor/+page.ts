export const load = async ({ locals }: { locals: { user: any } }) => {
  return {
    user: locals?.user,
  };
};
