exports.handler = async function (event, context) {
  if (event.body) {
    const data = JSON.parse(event.body);
    console.log(data);
  }
  return {
    statusCode: 200,
  };
};
