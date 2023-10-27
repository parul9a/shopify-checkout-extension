import React, { useState, useEffect, useCallback } from "react";
import {
  reactExtension,
  Banner,
  BlockStack,
  Form,
  useSettings,
  TextField,
  Grid,
  GridItem,
  Select,
  useExtensionCapability,
  useBuyerJourneyIntercept,
  useMetafield,
  useApplyMetafieldsChange,
  useStorage,
} from "@shopify/ui-extensions-react/checkout";

// Set the entry points for the extension
const checkoutBlock = reactExtension("purchase.checkout.block.render", () => (
  <App />
));
export { checkoutBlock };

const deliveryAddress = reactExtension(
  "purchase.checkout.delivery-address.render-before",
  () => <App />
);
export { deliveryAddress };

function App() {
  // Use the merchant-defined settings to retrieve the extension's content
  // Use the merchant-defined settings to retrieve the extension's content
  const {
    title: merchantTitle,
    description,
    collapsible,
    status: merchantStatus,
    enableDropdown,
    Dropdown_title,
    Name_text_field,
    Max_length_title,
    dropdown_value_1,
    dropdown_value_2,
    dropdown_value_3,
    dropdown_value_4,
    dropdown_value_5,
  } = useSettings();

  const {
    Regular_expression_dropdown_1,
    Regular_expression_dropdown_2,
    Regular_expression_dropdown_3,
    Regular_expression_dropdown_4,
    Regular_expression_dropdown_5,
  } = useSettings();
  const {
    Custom_error_message_regex_1,
    Custom_error_message_regex_2,
    Custom_error_message_regex_3,
    Custom_error_message_regex_4,
    Custom_error_message_regex_5,
  } = useSettings();
  const [selectValue, setSelectValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [err, setErr] = useState();
  const [validationError, setValidationError] = useState("");
  const [selectError, setSelectError] = useState("");
  const [showErrorBanner, setShowErrorBanner] = useState(false);
  const [loading, setLoading] = useState(false);

  const canBlockProgress = useExtensionCapability("block_progress");
  const [doctype, setDoctype] = useStorageState("doc-type");
  const [docnum, setDocnum] = useStorageState("doc-num");
  const label = canBlockProgress
    ? Name_text_field
    : Name_text_field + "(optional)";
  useEffect(() => {
    console.log("selectValue", selectValue, "inputValue", inputValue);

    if (
      canBlockProgress &&
      isNumberSet() &&
      isSelectSet() &&
      !isNumberValid()
    ) {
      showValidationErrors("Enter Valid Details");
      //    scrollIntoView({
      //     behavior: 'smooth',
      //     block: 'center',
      //     inline: 'start',
      // });
      return;
    }
    clearValidationErrors();

    if (
      doctype.data !== undefined &&
      doctype.data !== null &&
      docnum.data !== undefined &&
      docnum.data !== null
    ) {
      handleSelectChange(doctype.data);
      console.log("useEffect if: " + doctype.data);
      handleValueChange(docnum.data);
      console.log("useEffect if: " + docnum.data);
    }
  }, [doctype.data, docnum.data]);

  useBuyerJourneyIntercept(() => {
    console.log("running useBuyerJourneyIntercept");
    if (!isSelectSet()) {
      return {
        behavior: "block",
        reason: "Document Type is required",
        perform: (result) => {
          // If we were able to block progress, set a validation error
          if (result.behavior === "block") {
            setSelectError("Document Type is required");
            // scrollIntoView({
            //       behavior: 'smooth',
            //       block: 'center',
            //       inline: 'start',
            //   });
          }
        },
      };
    }
    // Validate that the age of the buyer is known, and that they're old enough to complete the purchase
    if (!isNumberSet()) {
      return {
        behavior: "block",
        reason: "Document Number is required",
        perform: (result) => {
          // If we were able to block progress, set a validation error
          if (result.behavior === "block") {
            setValidationError("Document Number is required");
            // scrollIntoView({
            //       behavior: 'smooth',
            //       block: 'center',
            //       inline: 'start',
            //   });
          }
        },
      };
    }

    let testVal = isNumberValid();
    console.log("check isNumberValid", testVal);
    if (isNumberValid()) {
      return {
        behavior: "allow",
        perform: () => {
          // Ensure any errors are hidden
          clearValidationErrors();
        },
      };
    }
    if (!isNumberValid()) {
      return {
        behavior: "block",
        reason: "Not a valid Number",
        perform: (result) => {
          // If progress can be blocked, then set a validation error, and show the banner
          if (result.behavior === "block") {
            console.log("number invalid", err);
            // if(err != null && err != undefined){
            //   setValidationError("Enter a valid Id -" + err);
            // }else{
            //   setValidationError("Enter a valid Id");
            // }

            // scrollIntoView({
            //       behavior: 'smooth',
            //       block: 'center',
            //       inline: 'start',
            //   });
          }
        },
      };
    }

    return {
      behavior: "allow",
      perform: () => {
        // Ensure any errors are hidden
        clearValidationErrors();
      },
    };
  });

  const applyMetafieldsChange = useApplyMetafieldsChange();
  // // Define the metafield namespace and key
  const metafieldNamespace = "custom";
  const metafieldKey = "document_type";

  // //Get a reference to the metafield
  const document_type = useMetafield({
    namespace: metafieldNamespace,
    key: metafieldKey,
  });
  const handleSelectChange = (value) => {
    console.log("handleSelectChange");
    setSelectValue(value);
    clearValidationErrors();
    setDoctype(value);
    if (value !== undefined) {
      setSelectValue(value);
      console.log("function handleSelectChange: " + value);
    }
    // Simulate a server request

    setLoading(true);

    return new Promise((resolve) => {
      setTimeout(() => {
        // Send the review to the server

        setLoading(false);

        setSelectValue(value);

        resolve();
      }, 750);
    });
  };
  const handleValueChange = (value) => {
    console.log("handleValueChange");
    setInputValue(value);
    setDocnum(value);
    if (value !== undefined) {
      setInputValue(value);
      console.log("function handleSelectChange: " + value);
    }
    // Simulate a server request

    setLoading(true);

    return new Promise((resolve) => {
      setTimeout(() => {
        // Send the review to the server

        setLoading(false);

        setInputValue(value);

        resolve();
      }, 750);
    });
  };

  function isNumberValid() {
    let flag = false;
    //console.log("is number valid fn inside --- selectValue",selectValue,"inputValue",inputValue);
    items.map((item) => {
      if (item.name == selectValue) {
        console.log(item.name, "==", selectValue);
        const reg = item.reg;
        //console.log("reg",reg);
        const pattern = new RegExp(reg);
        //console.log("pattern",pattern);
        if (pattern.test(inputValue)) {
          console.log("Personal Information");
          let val = " Personal Information :" + selectValue + "-" + inputValue;
          console.log("val", val);
          //isNumberValid(selectValue,value);
          // Apply the change to the metafield
          applyMetafieldsChange({
            type: "updateMetafield",
            namespace: metafieldNamespace,
            key: metafieldKey,
            valueType: "string",
            value: val,
          });
          //console.log('valid dd',document_type,"value",val,"namespace",metafieldNamespace,"key",metafieldKey);
          clearValidationErrors();
          flag = true;
          return false;
        } else {
          setErr(item.err);
          console.log("item error ", item.err);
          if (item.err != null && item.err != undefined) {
            setValidationError("Enter a valid Id -" + item.err);
          } else {
            setValidationError("Enter a valid Id");
          }
          console.log("error", err);
          flag = false;
          return false;
        }
      }
    });
    return flag;
  }
  function isNumberSet() {
    return inputValue !== "";
  }
  function isSelectSet() {
    return selectValue !== "";
  }
  function showValidationErrors() {
    setShowErrorBanner(true);
  }
  function showSelectErrors() {
    setShowErrorBanner(true);
  }
  function clearValidationErrors() {
    setValidationError("");
    setSelectError("");
    setShowErrorBanner(false);
  }
  const items = [
    {
      id: 1,
      name: dropdown_value_1,
      reg: Regular_expression_dropdown_1,
      err: Custom_error_message_regex_1,
    },
    {
      id: 2,
      name: dropdown_value_2,
      reg: Regular_expression_dropdown_2,
      err: Custom_error_message_regex_2,
    },
    {
      id: 3,
      name: dropdown_value_3,
      reg: Regular_expression_dropdown_3,
      err: Custom_error_message_regex_3,
    },
    {
      id: 4,
      name: dropdown_value_4,
      reg: Regular_expression_dropdown_4,
      err: Custom_error_message_regex_4,
    },
    {
      id: 5,
      name: dropdown_value_5,
      reg: Regular_expression_dropdown_5,
      err: Custom_error_message_regex_5,
    },
  ];

  // Set a default status for the banner if a merchant didn't configure the banner in the checkout editor
  // const matches = enableDropdown.match("Show");
  console.log("enableDropdown: " + enableDropdown);
  // Render the banner
  return (
    <BlockStack>
      {enableDropdown === "Show" ? (
        <>
          <Form>
            <Grid columns={["50%", "50%"]} spacing="base">
              <GridItem>
                <Select
                  id="selectValue"
                  label={Dropdown_title}
                  value={selectValue}
                  required={canBlockProgress}
                  error={selectError}
                  onChange={(value) => handleSelectChange(value)}
                  options={[
                    {
                      value: dropdown_value_1,
                      label: dropdown_value_1,
                    },
                    {
                      value: dropdown_value_2,
                      label: dropdown_value_2,
                    },
                    {
                      value: dropdown_value_3,
                      label: dropdown_value_3,
                    },
                    {
                      value: dropdown_value_4,
                      label: dropdown_value_4,
                    },
                    {
                      value: dropdown_value_5,
                      label: dropdown_value_5,
                    },
                  ]}
                />
              </GridItem>
              <GridItem>
                <TextField
                  id="document_number"
                  label={label}
                  value={inputValue}
                  onChange={(value) => handleValueChange(value)}
                  maxLength={Max_length_title}
                  onInput={clearValidationErrors}
                  required={canBlockProgress}
                  error={validationError}
                ></TextField>
              </GridItem>
            </Grid>
          </Form>
        </>
      ) : (
        <BlockStack> </BlockStack>
      )}
    </BlockStack>
  );
}

function useStorageState(key) {
  const storage = useStorage();

  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  console.log("key useStorage keyfunction: ", key);

  useEffect(() => {
    async function queryStorage() {
      const value = await storage.read(key);

      setData(value);

      console.log("setData value: " + value);

      setLoading(false);
    }

    queryStorage();
  }, [setData, setLoading, storage, key]);

  const setStorage = useCallback(
    (value) => {
      console.log("key in setStorage: ", key);

      storage.write(key, value);

      console.log(value);
    },
    [storage, key]
  );

  return [{ data, loading }, setStorage];
}
