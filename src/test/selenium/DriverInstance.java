package test.selenium;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
 
/**
 * Used to retrieve a vendor specific web driver, currently only using Chrome.
 * 
 * @author crm
 *
 */
public class DriverInstance {
 
    private static WebDriver driver;
   
    public static WebDriver getDriver() {
        if (driver == null) {
            driver = new FirefoxDriver();
        }
        return driver;
    }
}