use config::*;
use std::env;
use serde_derive::Deserialize;

#[derive(Debug, Deserialize)]
pub struct Configuration {
    store_directory: String
}

impl Configuration {
    pub fn new()->Result<Self, ConfigError> {
        let mut config = Config::new();
        let environment = env::var("RUST_ENV")
            .unwrap_or("development".into());

        config.merge(
            File::with_name("../configuration.json"));
        config.merge(
            File::with_name(format!("../configuration-{}.json", environment)
                .as_str()));

        config.try_into()
    }
}


#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let settings = Configuration::new().unwrap();

        assert!(settings.store_directory != "")
    }
}