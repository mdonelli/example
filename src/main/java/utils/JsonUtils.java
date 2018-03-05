package utils;

import org.json.simple.JSONObject;

public enum JsonUtils {

    INSTANCE;

    public static String jsonOk() {
        JSONObject json = new JSONObject();
        json.put("success", "true");
        return json.toJSONString();
    }

    public static String jsonError(String message) {
        JSONObject json = new JSONObject();
        json.put("success", "false");
        json.put("error", message);
        return json.toJSONString();
    }

    public static String jsonResponse(String data) {
        JSONObject json = new JSONObject();
        json.put("success", "true");
        json.put("data", data);
        return json.toJSONString();
    }

}
