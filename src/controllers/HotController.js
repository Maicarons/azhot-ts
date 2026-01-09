import { Elysia } from "elysia";
import { HotService } from "../services/HotService";
export const hotController = new Elysia({ name: "controller:hot" })
  .decorate("hotService", new HotService())
  .get("/list", ({ hotService }) => {
    return hotService.getPlatformList();
  })
  .get("/:platform", async ({ params: { platform }, hotService }) => {
    return hotService.getHotData(platform);
  })
  .get("/all", ({ hotService }) => {
    return hotService.getAllHotData();
  });
