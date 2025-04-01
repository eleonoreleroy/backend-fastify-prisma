
const books = [];

async function booksMemoryRoute(fastify, options) {

  fastify.get('/get', async (request, reply) => {
    reply.send(books);
  });

  const getBookSchema = {
    params: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
      },
    },
  };

  fastify.get('/:id/get', { schema: getBookSchema }, async (request, reply) => {
    const bookId = parseInt(request.params.id, 10);
    const book = books.find(b => b.id ===bookId);

    if (!book) {
      return reply.code(404).send({ error: 'Book not found'});
    }

    reply.send(book);
  });

  const createBookSchema = {
    body: {
      type: 'object',
      required: ['title', 'author'],
      properties: {
        title: { type: 'string' },
        author: { type: 'string' },
      },
    },
  };

  fastify.post('/post', { schema: createBookSchema }, async (request, reply) => {
    const {title, author} = request.body;

    const newBook = {
      id: book.length + 1,
      title,
      author
    };

    books.push(newBook);

    reply.code(201).send(newBook);
  });

  const updateBookSchema = {
    params: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
      },
    },
    body: {
      type: 'object',
      required: ['title', 'author'],
      properties: {
        title: { type: 'string' },
        author: { type: 'string' },
      },
    },
  };

  fastify.put('/:id/put', { schema: updateBookSchema }, async (request, reply) => {
    const bookId = parseInt(request.params.id, 10);
    const { title, author } = request.body;

    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex === -1) {
      return reply.code(404).send({ error: 'Book not found'});
    }

    books[bookIndex] = { id: bookId, title, author };
    reply.send(books[bookIndex]);
  });

  const deleteBookSchema = {
    params: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
      },
    },
  };
  fastify.delete('/:id/delete', { schema: deleteBookSchema }, async (request, reply) => {
    const bookId = parseInt(request.params.id, 10)
    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex === -1) {
      return reply.code(404).send({ error: 'Book not found' })
    }

    books.splice(bookIndex, 1);
    reply.code(204).send();
  });
}

export default booksMemoryRoute;