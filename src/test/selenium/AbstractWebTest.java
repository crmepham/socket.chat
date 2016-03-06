package test.selenium;

import org.junit.After;
import org.openqa.selenium.WebDriver;

import junit.framework.TestCase;
 
/**
 * Base test class that instantiates a GUI browser driver and safely closes it.
 *
 * @author Chris Mepham
 *
 */
public class AbstractWebTest extends TestCase {
 
    protected WebDriver driver;
    protected String baseUrl;
 
    @Override
    protected void setUp() throws Exception {
        super.setUp();
        driver = DriverInstance.getDriver();
        baseUrl = "https://socket.chat/";
    }
}