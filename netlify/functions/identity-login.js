exports.handler = async function (event, context) {
  const { identity, user } = context.clientContext;
  console.log({ identity, user });
  console.log({ context });
  return {
    statusCode: 200,
  };
};
