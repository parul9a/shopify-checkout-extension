import {
  BlockStack,
  Text,
  TextBlock,
  List,
  ListItem,
  useApi,
  useSettings,
  reactExtension,
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension("purchase.checkout.block.render", () => (
  <Extension />
));

function Extension() {
  const {
    enable_shipping_time,
    estimated_shipping_heading1,
    estimated_shipping_textbox1,
    estimated_shipping_list_item1,
    estimated_shipping_list_item2,
    estimated_shipping_list_item3,
    estimated_shipping_heading2,
    estimated_shipping_textbox2,
  } = useSettings();
  const { extension } = useApi();

  return (
    <BlockStack spacing={"loose"}>
      {enable_shipping_time === "Show" ? (
        <>
          <BlockStack spacing={"extraTight"} inlineAlignment="center">
            <Text emphasis="bold" size="medium">
              {estimated_shipping_heading1}
            </Text>
            <List>
              <ListItem>{estimated_shipping_list_item1}</ListItem>
              <ListItem>{estimated_shipping_list_item2}</ListItem>
              <ListItem>{estimated_shipping_list_item3}</ListItem>
            </List>
            <TextBlock size="base">{estimated_shipping_textbox1}</TextBlock>
          </BlockStack>

          <BlockStack spacing={"extraTight"} inlineAlignment="center">
            <Text emphasis="bold" size="medium">
              {estimated_shipping_heading2}
            </Text>
            <TextBlock size="base">{estimated_shipping_textbox2}</TextBlock>
          </BlockStack>
        </>
      ) : (
        <BlockStack> </BlockStack>
      )}
    </BlockStack>
  );
}
