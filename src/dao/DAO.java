package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import javax.sql.DataSource;

public class DAO {

	public void persistSession() {

		DataSource ds = DataSourceFactory.getMySQLDataSource();

		try (Connection con = ds.getConnection()) {
			try (PreparedStatement ps = con.prepareStatement("INSERT INTO session (datetime) VALUES (NOW())")) {
				ps.executeUpdate();

			} catch (SQLException e) {
				e.printStackTrace();
			}
		} catch (SQLException ex) {
			ex.printStackTrace();
		}
	}

}
