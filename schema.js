const fetch = require('node-fetch')
const util = require('util')
const parseXML = util.promisify(require('xml2js').parseString)
const {
	GraphQLInt,
	GraphQLObjectType,
	GraphQLList,
	GraphQLString,
	GraphQLSchema
} = require('graphql')


const AuthorType = new GraphQLObjectType({
	name: "Author",
	fields: () => ({
		name: {
			type: GraphQLString,
			resolve: xml =>
				xml.GoodreadsResponse.author[0].name[0]
		},
		books: {
			type: new GraphQLList(BookType),
			resolve: xml =>
				xml.GoodreadsResponse.author[0].books[0].book
		}
	})
})

const BookType = new GraphQLObjectType({
	name: "Book",
	fields: () => ({
		title: {
			type: GraphQLString,
			resolve: xml => xml.title[0]
		},
		isbn: {
			type: GraphQLString,
			resolve: xml => xml.isbn[0]
		}
	})
})

module.exports = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: "Query",
		description: "...",

		fields: () => ({
			author: {
				type: AuthorType,
				args: { id: { type: GraphQLInt } },
				resolve: (parent, args) => fetch(
						`https://www.goodreads.com/author/show.xml?id=${args.id}&key=Auq9WPYoORLyNFFYmaDcw`
					)
					.then(response => response.text())
					.then(parseXML)
			}
		})
	})
})