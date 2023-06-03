module.exports = (app)=>{
app.use((req, res, next) => {
  //something
  next();
});
}


