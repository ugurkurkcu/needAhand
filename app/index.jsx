import { Redirect } from "expo-router";

const index = () => {
  return <Redirect href="/(authenticate)/login" />;
};

export default index;
