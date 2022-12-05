
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


export default withData(MyApp);