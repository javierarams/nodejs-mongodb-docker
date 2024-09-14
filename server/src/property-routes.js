import { ObjectId } from "mongodb"

const DATABASE_DB = process.env.MONGO_INITDB_DATABASE;
const DATABASE_COLLECTION_PROPERTIES = process.env.DATABASE_COLLECTION_PROPERTIES;

/**
 * A plugin that provide encapsulated routes
 * @param {FastifyInstance} fastify encapsulated fastify instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes (fastify, options) {
  const collection = fastify.mongo.client.db(DATABASE_DB).collection(DATABASE_COLLECTION_PROPERTIES)

  fastify.get('/', async (request, reply) => {
    return { hello: 'world' }
  })

  fastify.get('/properties', async (request, reply) => {
    const result = await collection.find().toArray()
    if (result.length === 0) {
      throw new Error('No documents found')
    }
    return result
  })

  fastify.get('/properties/:id', async (request, reply) => {
    console.log('REQUEST', request.params.id)
    const result = await collection.findOne({ '_id': ObjectId.createFromHexString(request.params.id) })
    if (!result) {
      throw new Error('Invalid value')
    }
    return result
  })

  const propertyBodyJsonSchema = {
    type: 'object',
    required: ['title'],
    properties: {
      title: { type: 'string' },
    },
  }

  const schema = {
    body: propertyBodyJsonSchema,
  }

  fastify.post('/properties', { schema }, async (request, reply) => {
    const result = await collection.insertOne({ 
      title: request.body.title,
      location: request.body.location,
      price: request.body.price,
      images: request.body.images,
    })
    return result
  })
}

export default routes;