import fetch, { Headers } from "node-fetch";

exports.handler = async function (event, context) {
  const { identity, user } = context.clientContext;
  console.log(context.clientContext);
  console.log({ event });
  console.log({ context });
  //   console.log({ identity, user });
  //   console.log({ context });
  if (identity) {
    const token = "Bearer " + identity.token;
    console.log({ token });
    const response = await fetch(identity.url + "/user", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      headers: new Headers({
        Authorization: token,
      }),
    });
    const result = await response.json();
    console.log({ result });
  }
  return {
    statusCode: 200,
    body: JSON.stringify(context),
  };
};
