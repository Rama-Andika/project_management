<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Haruncpi\LaravelIdGenerator\IdGenerator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;




class ProjectController extends Controller
{
    public $counter;

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $project = Project::with('projectDetails.projectName')->when(request()->q, function ($project) {
            $project = $project->where('name', 'like', '%' . request()->q . '%');
        })->orderBy('number')->paginate(10);

        //return with Api Resource
        return new ProjectResource(true, 'List Data Project Detail', $project);
    }

    public function searchBy( $number, $startDate, $endDate)
    {
        $projects = Project::with('projectDetails.projectName')
                    ->whereRaw('number LIKE "%'.$number.'%" AND DATE_FORMAT(projects.created_at, "%Y-%m-%d") BETWEEN "'.$startDate.'" AND "'.$endDate.'"')
                    ->orderBy('number')
                    ->paginate(10);
                    
                    

        //return with Api Resource
        return new ProjectResource(true, 'List Data Project Detail', $projects);
    }



    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        

        $validator = Validator::make($request->all(), [

            'project_name'     => 'required|unique:projects',
            'status'     => 'required|integer',

        ]);



        if ($validator->fails()) {

            return response()->json($validator->errors(), 422);
        }

        $number = IdGenerator::generate(['table' => 'projects','field'=>'number', 'length' => 14, 'prefix' =>'PRJ-'.date("ym")."-"]);
        
        
       //create project

        $project = Project::create([

            'number' => $number,

            'project_name' => $request->project_name,

            'status' => $request->status,

            'prefix_number' => 'PRJ/'.date("ym"),

        ]);



        if ($project) {

            //return success with Api Resource
            

            return new ProjectResource(true, 'Data Project Berhasil Disimpan!', $project);
        }



        //return failed with Api Resource

        return new ProjectResource(false, 'Data Project Gagal Disimpan!', null);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        
        $project = Project::with('projectDetails')->whereId($id)->first();

        if ($project) {
            return new ProjectResource(true, 'Detail data Project ', $project);
        }

        return new ProjectResource(true, 'Detail data Project tidak ditemukan', null);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Project $project)
    {
        $validator = Validator::make($request->all(), [
            'project_name'     => 'required|unique:projects,project_name,' . $project->id,
            'status'     => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $number = Project::whereId($project->id)->first()->number;
        //update project withour image
        $project->update([
            'number' => $number,

            'project_name' => $request->project_name,

            'status' => $request->status,

            'prefix_number' => 'PRJ/'.date("ym"),

        ]);

        if ($project) {
            return new ProjectResource(true, 'Data project berhasil di update', $project); # code...
        }

        return new ProjectResource(false, 'Data project gagal di update', null);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Project $project)
    {
        if ($project->delete()) {
            // $current_number = Project::whereId($project->id)->first()->number;
            // $min_number = Project::orderBy($project->id)->first()->number;
            // if($current_number > $min_number){

            // }
            

            return new ProjectResource(true, 'Data project berhasil di hapus', null);
        }

        return new ProjectResource(false, 'Data project gagal di hapus', null);
    }
}
