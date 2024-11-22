package utils

import (
	"log"
	"os"
	"path/filepath"
	"runtime"

	"github.com/joho/godotenv"
)

// https://www.reddit.com/r/golang/comments/12hsaoe/comment/khylnis/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
// https://towardsdatascience.com/use-environment-variable-in-your-next-golang-project-39e17c3aaa66
// https://stackoverflow.com/questions/18537257/how-to-get-the-directory-of-the-currently-running-file

// This package is now unused, as I wrote it before I remembered that when working in a monorepo with react - it is a pain to get react to
// ... load any .env files outside of its src directory.


// Load .env file & return requested env variable value if defined, error if not.
func GetEnv(key string) string {
	var _, executableFileName, _, _ = runtime.Caller(0);
	var targetEnvFilePath = filepath.Join(filepath.Dir(executableFileName),"..","..",".env.local")


	err := godotenv.Load(targetEnvFilePath)

	if(err != nil) {
		log.Fatalf("Error loading .env.local file at location '%s'",targetEnvFilePath)
	}

	var envValue = os.Getenv(key)

	if(envValue == "") {
		log.Fatalf("Enviroment variable '%s' is undefined, please check your .env.local file located at '%s'",key, targetEnvFilePath)
	}

	return envValue
}