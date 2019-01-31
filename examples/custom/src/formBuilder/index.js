import FormBuilder from "@elevenlabs/react-formbuilder";
import theme from "./theme";
import translate from "./translate";

export const initConfigFormBuilder = () => {
    FormBuilder.translate = translate;
    FormBuilder.theme = theme;
}