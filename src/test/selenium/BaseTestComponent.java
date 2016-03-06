package test.selenium;

import org.openqa.selenium.WebDriver;

/**
 * Base test component, which holds the WebDriver instance as well as the base URL for testing.
 *
 * @author Chris Mepham
 */
public abstract class BaseTestComponent {
 
    protected final WebDriver driver;
    protected final String baseUrl;
 
    public BaseTestComponent(WebDriver driver, String baseUrl) {
        super();
        this.driver = driver;
        this.baseUrl = baseUrl;
    }
 
}