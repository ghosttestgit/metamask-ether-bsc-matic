const { exec } = require("child_process");

function gitAddCommitPush(message) {
  exec(
    "cd /home/ubuntu/team_management/server/dist/src/Node-Ethers/",
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error occurred while cd files: ${error.message}`);
        return;
      }
      exec("git add .", (error, stdout, stderr) => {
        if (error) {
          console.error(`Error occurred while adding files: ${error.message}`);
          return;
        }

        exec(`git commit -m "${message}"`, (error, stdout, stderr) => {
          if (error) {
            console.error(
              `Error occurred while committing changes: ${error.message}`
            );
            return;
          }

          exec("git push", (error, stdout, stderr) => {
            if (error) {
              console.error(
                `Error occurred while pushing changes: ${error.message}`
              );
              return;
            }

            console.log("Changes committed and pushed successfully.");
          });
        });
      });
    }
  );
}

// Usage example
gitAddCommitPush("update sql backup");
