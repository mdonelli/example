package utils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public enum DbUtils {

    INSTANCE;

    public static String CONNSTRING = "jdbc:postgresql://localhost:5432/example";
    public static String DBUSER = "example_webapp";
    public static String DBPASS = "qwerty";


    public static Connection getConnection() throws SQLException{

        return DriverManager.getConnection(CONNSTRING, DBUSER, DBPASS);


    }

}