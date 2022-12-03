import { gql } from "graphql-request";

export const ENSListQuery = gql`
  query ENSListQuery($address: String!) {
    domains(where: { owner: $address }) {
      id
      name
    }
  }
`;
