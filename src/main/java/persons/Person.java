package persons;

import org.json.simple.JSONObject;
import utils.DbUtils;
import utils.JsonConvertible;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class Person implements JsonConvertible {
    private int idPerson = 0;
    private String name = null;
    private String lastName = null;
    private String oib = null;
    private Integer age = null;

    public Person() {
    }

    public Person(int id) throws  Exception{
        this.load(id);
    }

    public Person(String name, String lastName, String oib, Integer age) throws Exception{
        this.name = name;
        this.lastName = lastName;
        this.setOib(oib);
        this.age = age;
    }

    public Person(int id, String name, String lastName, String oib, Integer age) throws Exception{
        this(name, lastName, oib, age);
        this.idPerson = id;
    }

    public void save() throws Exception {

        if (this.getIdPerson() == 0) {
            this.insert();
        } else {
            this.update();
        }

    }

    protected void insert() throws Exception {

        try (Connection conn = DbUtils.getConnection()) {

            try (PreparedStatement prst = conn.prepareStatement("insert into persons(name, last_name, oib, age)" +
                    " values(?,?,?,?) ", Statement.RETURN_GENERATED_KEYS)) {

                this.setStatementParams(prst);

                prst.executeUpdate();

                try (ResultSet rs = prst.getGeneratedKeys()) {
                    if (!rs.next()) {
                        throw new Exception("Failed to insert new person");
                    } else {
                        this.setIdPerson(rs.getInt("id_person"));
                    }
                }

            }

        }
    }

    protected void update() throws Exception {

        try (Connection conn = DbUtils.getConnection()) {

            try (PreparedStatement prst = conn.prepareStatement("update persons set name=?, last_name=?, oib=?, age=?" +
                    " where id_person=? ")) {

                this.setStatementParams(prst);
                prst.setInt(5, this.getIdPerson());

                if (prst.executeUpdate() == 0) {
                    throw new Exception( "Failed to update person");
                }

            }

        }

    }

    protected void setStatementParams (PreparedStatement prst) throws SQLException{
        prst.setString(1, this.getName());
        prst.setString(2,this.getLastName());
        prst.setString(3, this.getOib());
        if (this.getAge() == null) {
            prst.setNull(4, Types.INTEGER);
        } else {
            prst.setInt(4, this.getAge());
        }
    }

    public void load(int id) throws Exception {

        if (id <= 0) {
            throw new Exception("Id cannot be 0 or negative");
        }

        try (Connection conn = DbUtils.getConnection()){

            try(PreparedStatement prst = conn.prepareStatement("select * from persons where id_person=?")) {
                prst.setInt(1,id);

                try (ResultSet rs = prst.executeQuery()) {
                    if (!rs.next()) {
                        throw new Exception("Person with id " + id + " not found");
                    } else {
                        this.setIdPerson(id);
                        this.setName(rs.getString("name"));
                        this.setLastName(rs.getString("last_name"));
                        this.setOib(rs.getString("oib"));
                        this.setAge(rs.getInt("age"));
                        if (rs.wasNull()) {
                            this.setAge(null);
                        }
                    }
                }
            }
        }

    }

    public static void deletePersonById(int id) throws Exception {
        if (id <= 0) {
            throw new Exception("Id cannot be 0 or negative");
        }

        try (Connection conn = DbUtils.getConnection()) {
            try (PreparedStatement prst = conn.prepareStatement("delete from persons where id_person=?")) {
                prst.setInt(1, id);

                if (prst.executeUpdate() == 0) {
                    throw new Exception( "Failed to delete person");
                }

            }
        }
    }

    public static List<Person> loadAllPersons() throws Exception {

        List<Person> persons = new ArrayList();

        try (Connection conn = DbUtils.getConnection()){

            try(PreparedStatement prst = conn.prepareStatement("select * from persons")) {

                try (ResultSet rs = prst.executeQuery()) {

                    while (rs.next()) {

                        Integer age = rs.getInt("age");
                        if (rs.wasNull()) {
                            age = null;
                        }

                        persons.add(new Person(rs.getInt("id_person"), rs.getString("name"),
                                rs.getString("last_name"), rs.getString("oib"), age));

                    }

                    return persons;

                }
            }
        }

    }

    @Override
    public JSONObject getJson() {
        JSONObject json = new JSONObject();
        json.put("idPerson", this.getIdPerson());
        json.put("name", this.getName());
        json.put("lastName", this.getLastName());
        json.put("oib", this.getOib());
        json.put("age", this.getAge());
        return json;
    }

    public int getIdPerson() {
        return idPerson;
    }

    public void setIdPerson(int idPerson) {
        this.idPerson = idPerson;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getOib() {
        return oib;
    }

    public void setOib(String oib) throws Exception {
        if (oib != null && oib.length() != 11) {
            throw new Exception("Oib must be 11 characters or null");
        }
        this.oib = oib;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }
}
