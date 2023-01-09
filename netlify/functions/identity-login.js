import fetch from "node-fetch";

exports.handler = async function (event, context) {
  //   const { identity, user } = context.clientContext;
  if (event.body) {
    const data = JSON.parse(event.body);
    console.log(data);
  }
  return {
    statusCode: 200,
  };
};
