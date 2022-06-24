require("dotenv").config();
const Airtable = require("airtable-node");

const airtable = new Airtable({ apiKey: process.env.API_KEY })
  .base("app32VLAdt5CG6God")
  .table("recipes");

exports.handler = async (event, context) => {
  const { id } = event.queryStringParameters;
  if (id) {
    try {
      const recipes = await airtable.retrieve(id);
      if (recipes.error) {
        return {
          statusCode: 404,
          body: `Error, We Cannot Find The Recipe of ID ${id}`,
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify(recipes),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: "Sever Error",
      };
    }
  }

  try {
    const { records } = await airtable.list();
    // console.log(records.length);
    const recipes = records.map((recipe) => {
      const { id } = recipe;
      const { name, price, type, category, desciption, images, featured } =
        recipe.fields;
      const url = images[0].url;

      return { id, name, price, type, category, desciption, url, featured };
    });

    return {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      statusCode: 200,
      body: JSON.stringify(recipes),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: "Sever Error",
    };
  }
};
