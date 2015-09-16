package dao;

import javax.sql.DataSource;

import com.mysql.jdbc.jdbc2.optional.MysqlDataSource;

// establishes a persistent database connection
public class DataSourceFactory {

	public static DataSource getMySQLDataSource() {
		MysqlDataSource mysqlDS = null;
		final Configuration conf = new Configuration();
		final String dbHostName = conf.getDbHostName();
		final String dbDatabaseName = conf.getDbDatabaseName();
		final String dbUsername = conf.getDbUsername();
		final String dbPassword = conf.getDbPassword();
		final int dbPortNumber = conf.getDbPortNumber();

		try {
			mysqlDS = new MysqlDataSource();
			mysqlDS.setServerName(dbHostName);
			mysqlDS.setPortNumber(dbPortNumber);
			mysqlDS.setDatabaseName(dbDatabaseName);
			mysqlDS.setUser(dbUsername);
			mysqlDS.setPassword(dbPassword);
		} catch (Exception e) {
			throw new IllegalStateException(e);
		}
		return mysqlDS;
	}
}