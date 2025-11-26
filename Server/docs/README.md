echo "# Test" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/klettenberg1970/Test.git
git push -u origin main

git config user.name "Dein Name"
git config user.email "deine.email@example.com"


Befehl      |  Wirkung                                 
------------+------------------------------------------
git add     |  Datei zum Commit vormerken (kein Output)
git status  |  Zeigt, ob Datei für Commit bereitsteht  
git commit  |  Änderungen festschreiben                
git push    |  Änderungen auf GitHub hochladen   

git add README.md
git commit -m "README-md"
git push
