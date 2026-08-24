import { startRandomRollPage } from "../../default_main_page";
import { buildXccSheet } from "./populate_xcc_template";
import { default_build } from "./xcc_impl";

startRandomRollPage({
  generate: default_build,
  outputRenderer: buildXccSheet,
});
