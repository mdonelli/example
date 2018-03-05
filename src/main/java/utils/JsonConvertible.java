package utils;

import org.json.simple.JSONObject;

public interface JsonConvertible {

    JSONObject getJson();

    default String toJsonString() {
        return this.getJson().toJSONString();
    }
}
