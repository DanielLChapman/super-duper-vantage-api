
import Page from "../src/Components/Page";
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql,
} from "@apollo/client";
import withData from '../library/apollo';

function MyApp({ Component, pageProps, apollo }) {
    return (
        <ApolloProvider client={apollo}>
            <Page>
                <Component {...pageProps} />
            </Page>
        </ApolloProvider>
    );
}

MyApp.getInitialProps = async function ({ Component, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
    }
    pageProps.query = ctx.query;
    return { pageProps };
};

export default withData(MyApp);